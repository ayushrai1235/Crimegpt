# Evidence Explorer

## 1. Overview
The Evidence Explorer is a dedicated module within the Investigation Workspace that handles the viewing, parsing, and interaction with raw documents (like FIR PDFs, Chargesheets, and images).

## 2. Purpose
To bridge the gap between unstructured raw files and the structured AI insights. It ensures the officer can always "trust but verify" by looking at the source document alongside the AI's extraction.

## 3. Functional Requirements
- **Integrated PDF Viewer**: Must render the original uploaded FIR without leaving the browser.
- **Highlighting**: (Stretch goal) When the AI cites a specific paragraph, the Evidence Explorer highlights that paragraph in the PDF.
- **Metadata Panel**: Shows the hard data extracted by Catalyst/Gemini next to the document.

## 4. Technical Design
- **Frontend**: Uses `react-pdf` or the native browser object tag to display documents stored securely in the Catalyst File Store.
- **Storage**: Documents are securely retrieved via signed URLs from the Zoho Catalyst File Store.

## 5. Data Flow
Catalyst File Store -> Generates Signed URL -> Sent to Frontend -> Rendered in Evidence Explorer.

## 6. Edge Cases
- **Unreadable Scans**: If the PDF is a poor-quality handwritten scan, Gemini may fail OCR. The UI will prompt the officer to manually enter key metadata.

## 7. Future Enhancements
- Support for Audio/Video evidence files with automated transcription via Whisper.
