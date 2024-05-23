const reportCi = (dados) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginLeft = 20;
    const marginRight = 20;
    const marginTop = 10;
    const maxWidth = pageWidth - marginLeft - marginRight;
    const centerX = pageWidth / 2;

    // Logo
    const logoUrl = '/static/logonorte.jpg'; // Caminho da imagem servida pelo Flask
    const loadImage = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        return new Promise((resolve) => {
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    };

    loadImage(logoUrl).then((logoDataUrl) => {
        doc.addImage(logoDataUrl, 'JPEG', 10, 10, 50, 15);

        // Restante do código para criar o PDF
        doc.setFontSize(12);
        doc.text('SERAFIM TRANSPORTE DE CARGAS LTDA', centerX, 40, { align: 'center' });
        doc.setFontSize(10);
        doc.text('Rua: Nova Veneza, 172 Cumbica – Guarulhos-SP', centerX, 45, { align: 'center' });
        doc.text('Tel(11)2481-9121/2481-9697/2412-4886/2412-3927', centerX, 50, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Comunicação Interna Nº ${dados.ci_num}`, centerX, 70, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Data: ${dados.data} Percurso: ${dados.percurso}`, centerX, 75, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`${dados.destinatario},`, marginLeft, 90, { maxWidth });
        doc.text(`Enviamos anexo a esse CI o manifesto de nº ${dados.manifesto_numero} que será realizado pelo motorista ${dados.motorista}, referente ao período ${dados.percurso} para transporte de nossas mercadorias.`, marginLeft, 100, { maxWidth });
        doc.text(`Valor do frete: ${dados.valor_frete}`, marginLeft, 110, { maxWidth });
        doc.text(`Observações: ${dados.observacao}`, marginLeft, 120, { maxWidth });
        doc.text(`Isca 1: ${dados.isca_1}`, marginLeft, 130, { maxWidth });
        doc.text(`Isca 2: ${dados.isca_2}`, marginLeft, 140, { maxWidth });

        // Abrir o PDF em uma nova aba
        const pdfOutput = doc.output('blob');
        const url = URL.createObjectURL(pdfOutput);
        window.open(url);
    }).catch(error => {
        console.error('Erro ao carregar a imagem:', error);
    });
};
