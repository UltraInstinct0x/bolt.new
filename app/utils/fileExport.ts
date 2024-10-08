import JSZip from 'jszip';
import { webcontainer } from '~/lib/webcontainer';

const EXCLUDED_PATHS = ['node_modules','.env','.git','dist','build','.cache','.vscode','.github'];

export async function exportFilesAsZip() {
  const container = await webcontainer;
  const zip = new JSZip();

  async function addFolderToZip(folderPath: string) {
    const entries = await container.fs.readdir(folderPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = `${folderPath}/${entry.name}`;

      if (EXCLUDED_PATHS.some((excluded) => fullPath.includes(excluded))) {
        continue;
      }

      if (entry.isDirectory()) {
        await addFolderToZip(fullPath);
      } else {
        const content = await container.fs.readFile(fullPath, 'utf-8');
        zip.file(fullPath, content);
      }
    }
  }

  await addFolderToZip('/');

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
