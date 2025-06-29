import dotenv from "dotenv";
dotenv.config();
import nodemailer from 'nodemailer';
export async function enviarEmail(email, content, subject){

    // configura como quiero enviar el mail, con que plataforma y que cuenta
    const transporter = nodemailer.createTransport({
    service: 'gmail',
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.NODEMAILER_PASS    
      }
    });
    // Qué va a recibir el usuario
    const mailOptions = {
      from: `"Maria Alquileres App" <${process.env.EMAIL}>`,
      to: email,
      subject: subject,
      text: content,
    };
     try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
    return { status: 200, message: info.response};
   } catch (error) {
    console.log('Error al enviar el email:', error);
    return { status: 400, message: 'Error al enviar el email' };
  }
  }