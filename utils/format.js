export const formatValidationError = (errors) => {
    if(!errors.issues) return 'validation failed';

    if(Array.isArray(errors.issues)) return errors.issues.map( i => i.messages).join(', ');

    return  JSON.stringify(errors);
}