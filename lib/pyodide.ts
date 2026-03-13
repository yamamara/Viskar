// lib/pyodide.ts
let pyodidePromise: Promise<any> | null = null;

export async function getPyodide() {
  if (pyodidePromise) return pyodidePromise;

  pyodidePromise = new Promise(async (resolve, reject) => {
    try {
      if (typeof window === "undefined") return reject("Window not defined");

      // Check if script is already in document
      let script = document.querySelector('script[src*="pyodide.js"]') as HTMLScriptElement;
      
      if (!script) {
        script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        script.async = true;
        document.head.appendChild(script);
      }

      const checkPyodide = async () => {
        // @ts-ignore
        if (window.loadPyodide) {
           try {
             // @ts-ignore
             const pyodide = await window.loadPyodide({
               indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
             });
             resolve(pyodide);
           } catch (e) {
             reject(e);
           }
        } else {
          setTimeout(checkPyodide, 100);
        }
      };

      script.onload = checkPyodide;
      script.onerror = () => reject(new Error("Failed to load Pyodide script"));
    } catch (err) {
      reject(err);
    }
  });

  return pyodidePromise;
}
