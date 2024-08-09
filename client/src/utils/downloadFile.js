// utils/fileUtils.js

/**
 * Downloads a file as it is received from the server.
 * @param {Blob} fileBlob - The Blob object representing the file data.
 * @param {string} filename - The name of the file to download.
 */
export const downloadFile = (fileBlob, filename) => {
  try {
    const url = window.URL.createObjectURL(fileBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // Free up memory
  } catch (error) {
    console.error("Failed to download file:", error);
    alert("Error downloading the file.");
  }
};

/**
 * Downloads JSON data as a formatted file.
 * @param {Blob} fileBlob - The Blob object representing the file data.
 * @param {string} filename - The name of the file to download.
 */
export const downloadJsonFile = async (fileBlob, filename) => {
  try {
    // Read the blob as text
    const text = await fileBlob.text();

    // Parse and prettify the JSON log
    const parsedLog = text.split("\n").filter(Boolean).map(JSON.parse);

    // Convert to prettified JSON string
    const jsonString = JSON.stringify(parsedLog, null, 2);

    // Create a Blob with the prettified JSON data
    const jsonBlob = new Blob([jsonString], { type: "application/json" });

    // Trigger download
    downloadFile(jsonBlob, filename);
  } catch (error) {
    console.error("Failed to download JSON file:", error);
    alert("Error downloading the JSON file.");
  }
};
