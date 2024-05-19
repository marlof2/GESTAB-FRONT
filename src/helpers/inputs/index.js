const maskCpfCnpj = (inputText) => {
    let cleaned = inputText.replace(/\D/g, '');
    let masked = '';

    if (cleaned.length <= 11) { // CPF
        masked = cleaned.replace(/(\d{3})(\d{1,3})?(\d{1,3})?(\d{1,2})?/, function (_, g1, g2, g3, g4) {
            return `${g1}${g2 ? '.' + g2 : ''}${g3 ? '.' + g3 : ''}${g4 ? '-' + g4 : ''}`;
        });
    } else { // CNPJ
        masked = cleaned.replace(/(\d{2})(\d{1,3})?(\d{1,3})?(\d{1,4})?(\d{1,2})?/, function (_, g1, g2, g3, g4, g5) {
            return `${g1}${g2 ? '.' + g2 : ''}${g3 ? '.' + g3 : ''}${g4 ? '/' + g4 : ''}${g5 ? '-' + g5 : ''}`;
        });
    }

    return masked
};
const maskCpf = (inputText) => {
    let cleaned = inputText.replace(/\D/g, '');
    let masked = '';

    if (cleaned.length <= 11) { // CPF
        masked = cleaned.replace(/(\d{3})(\d{1,3})?(\d{1,3})?(\d{1,2})?/, function (_, g1, g2, g3, g4) {
            return `${g1}${g2 ? '.' + g2 : ''}${g3 ? '.' + g3 : ''}${g4 ? '-' + g4 : ''}`;
        });
    }

    return masked
};

const validateEmail = (email) => {
    // Regex para validação de e-mail
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  };


export const helper = {
    maskCpfCnpj,
    maskCpf,
    validateEmail
};