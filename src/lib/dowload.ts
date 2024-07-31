import dayjs from "dayjs";

export async function downloadFile(url: string, filename: string = '') {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const blob = await response.blob();
        const urlObject = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = urlObject;

        if (filename === '') {
            filename = url.split("/").pop() || dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.mp3';
        }

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(urlObject);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}