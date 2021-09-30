import sgMail from '@sendgrid/mail';
sgMail.setApiKey('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')

// async..await is not allowed in global scope, must use a wrapper
export async function sendMail(email, message) {
  
  const msg = {
    from: 'Adam <norenz@hotmail.com>', // sender address
    to: email, // list of receivers
    subject: `${message.subcategory} - ${message.title}`, // Subject line
    text: `Plats: ${message.exactlocation}\nBeskrivning: ${message.description}`, // plain text body
    html: `<p><b>Plats:</b> ${message.exactlocation}</p><p><b>Beskrivning:</b> ${message.description}</p>`, // html body
  }
  return sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent to ' + email)
    })
    .catch((error) => {
      console.error(error)
  })
}