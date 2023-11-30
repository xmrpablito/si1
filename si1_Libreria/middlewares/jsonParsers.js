

const isArrayBody = (value)=>{
  try {
    const parsedValue = JSON.parse(value);
    console.log(typeof parsedValue === "array");
    if (!Array.isArray(parsedValue)) {
      throw new Error('debe ser un arreglo');
    }
    return true;
  } catch (err) {
    throw new Error('El campo debe ser una cadena en formato JSON');
  }
}

export {
  isArrayBody
}