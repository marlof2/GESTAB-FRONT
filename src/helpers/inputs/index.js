const maskCpfCnpj = (inputText) => {
    if (!inputText) return ""
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
const maskCnpj = (inputText) => {
    if (!inputText) return ""
    let cleaned = inputText.replace(/\D/g, '');
    let masked = '';

    masked = cleaned.replace(/(\d{2})(\d{1,3})?(\d{1,3})?(\d{1,4})?(\d{1,2})?/, function (_, g1, g2, g3, g4, g5) {
        return `${g1}${g2 ? '.' + g2 : ''}${g3 ? '.' + g3 : ''}${g4 ? '/' + g4 : ''}${g5 ? '-' + g5 : ''}`;
    });

    return masked
};
const maskCpf = (inputText) => {
    if (!inputText) return ""
    let cleaned = inputText.replace(/\D/g, '');
    let masked = '';

    if (cleaned.length <= 11) { // CPF
        masked = cleaned.replace(/(\d{3})(\d{1,3})?(\d{1,3})?(\d{1,2})?/, function (_, g1, g2, g3, g4) {
            return `${g1}${g2 ? '.' + g2 : ''}${g3 ? '.' + g3 : ''}${g4 ? '-' + g4 : ''}`;
        });
    }

    return masked
};


const maskPhone = (value) => {
    if (!value) return value;
    const cleanedValue = value.replace(/\D/g, '');
    let maskedValue = cleanedValue;
    if (cleanedValue.length > 10) {
        maskedValue = cleanedValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanedValue.length > 6) {
        maskedValue = cleanedValue.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (cleanedValue.length > 2) {
        maskedValue = cleanedValue.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    } else if (cleanedValue.length > 0) {
        maskedValue = cleanedValue.replace(/(\d{0,2})/, '($1');
    }
    return maskedValue;
};

const validateEmail = (email) => {
    // Regex para validação de e-mail
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
};

const formatMoney = (value) => {
    // Remove tudo que não é dígito
    const cleanValue = value.replace(/\D/g, '');

    // Formata o valor para o formato de moeda brasileiro
    const formattedValue = (cleanValue / 100).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    return `R$ ${formattedValue}`;
};


const formatMoneyRemoveCaracters = (formattedValue) => {
    const cleanValue = formattedValue.replace(/[^\d,-]/g, '').replace(',', '.');
    return parseFloat(cleanValue).toFixed(2);
};


const formatTime = (input) => {
    if (!input) return input;
    let formattedInput = input.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

    // Formatação da entrada
    if (formattedInput.length > 4) {
      formattedInput = formattedInput.substring(0, 4);
    }
    if (formattedInput.length > 2) {
      formattedInput = formattedInput.replace(/(\d{2})(\d{1,2})/, '$1:$2');
    }

   return formattedInput
};



export const helper = {
    maskCpfCnpj,
    maskCpf,
    validateEmail,
    maskPhone,
    maskCnpj,
    formatMoney,
    formatMoneyRemoveCaracters,
    formatTime
};