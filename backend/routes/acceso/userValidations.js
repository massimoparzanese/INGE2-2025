// userValidations.js

export function validarDNI(dni) {
  if (!/^\d+$/.test(dni)) {
    return 'El DNI debe contener solo números';
  }
  if (dni.length !== 8) {
    return 'El DNI debe contener 8 números';
  }
  return null;
}

export function validarNombre(nombre) {
  return /\d/.test(nombre) ? 'El nombre no debe contener números' : null;
}

export function validarApellido(apellido) {
  return /\d/.test(apellido) ? 'El apellido no debe contener números' : null;
}

export function validarEmail(email) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !regexEmail.test(email) ? 'El correo no es válido' : null;
}

export function validarPassword(password) {
  return password.length < 6 ? 'La contraseña es inválida' : null;
}

export function validarEdad(fechaNacimiento) {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  const edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  const dia = hoy.getDate() - nacimiento.getDate();
  const esMenor = edad < 18 || (edad === 18 && (mes < 0 || (mes === 0 && dia < 0)));

  return esMenor ? 'El usuario debe ser mayor de 18 años.' : null;
}

