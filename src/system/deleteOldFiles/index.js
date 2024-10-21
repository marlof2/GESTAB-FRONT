import * as FileSystem from 'expo-file-system';

const clearFiles = async () => {
  try {
    // Listar os arquivos no diretório do aplicativo
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);

    const hasMatchingFile = files.some(file => file.includes('relatorio'));

    if (hasMatchingFile) {
      const relatorios = files.filter(file => file.includes('relatorio'));
      console.log(relatorios)

      for (const file of relatorios) {
        // Ignorar arquivos relacionados ao Firebase ou arquivos ocultos
        // if (!file.startsWith('.') && !file.includes('crashlytics')) {
        const filePath = `${FileSystem.documentDirectory}${file}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);

        const lastModified = new Date(fileInfo.modificationTime * 1000);
        const now = new Date();
        const diffDays = Math.floor((now - lastModified) / (1000 * 60 * 60 * 24)); // Diferença em dias
        // Se o arquivo tiver mais de 30 dias, excluí-lo
        if (diffDays > 2) {
          await FileSystem.deleteAsync(filePath, { idempotent: true });
          // console.log(`Arquivo excluído: ${file}`);
        }
        // }
      }
    }
  } catch (error) {
    console.error('Erro ao excluir arquivos antigos:', error);
  }
};


export default clearFiles;