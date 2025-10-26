export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        const workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url);
        lib.GlobalWorkerOptions.workerSrc = workerSrc.toString();
        pdfjsLib = lib;
        return lib;
    })

    .catch((err) => {
            console.error("Failed to load pdf.js:", err);
            isLoading = false;
            throw err;
        });

    return loadPromise;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        console.log("Starting PDF conversion:", file.name);
        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        console.log("PDF arrayBuffer loaded, size:", arrayBuffer.byteLength);

        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        console.log("PDF document loaded, numPages:", pdf.numPages);

        const page = await pdf.getPage(1);
        console.log("Page 1 loaded");

        const viewport = page.getViewport({ scale: 4 });
        console.log("Viewport:", viewport.width, viewport.height);

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Failed to get 2D canvas context");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        console.log("Rendering page to canvas...");
        await page.render({ canvasContext: context, viewport }).promise;
        console.log("Page rendered successfully");

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: "image/png",
                        });

                        console.log("Image blob created:", imageFile);
                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        console.error("Failed to create image blob");
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    }
                },
                "image/png",
                1.0
            );
        });
    } /*catch (err) {
        console.error("PDF conversion error:", err);
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
    };
    }*/
    catch (err: any) {
        console.error("PDF conversion error:", err);
        alert("Error: " + (err.message || err));
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err.message || err}`,
        };
    }

}