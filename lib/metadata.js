const { PDFDocument } = require('pdf-lib')
const pkg = require('../package.json')

const addMetadata = async (pdf, doc) => {
  const pdfDoc = await PDFDocument.load(pdf)
  let modificationDate
  let creationDate
  if (doc.hasAttribute('reproducible')) {
    const date = new Date()
    date.setTime(0)
    modificationDate = date
    creationDate = date
  } else {
    try {
      modificationDate = new Date(doc.getAttribute('docdatetime'))
    } catch (e) {
      modificationDate = new Date()
    }
    try {
      creationDate = new Date(doc.getAttribute('localdatetime'))
    } catch (e) {
      creationDate = new Date()
    }
  }
  pdfDoc.setTitle(doc.getDocumentTitle({ use_fallback: true }))
  pdfDoc.setAuthor(doc.getAttribute('authors', ''))
  pdfDoc.setSubject(doc.getAttribute('subject', ''))
  pdfDoc.setKeywords(doc.getAttribute('keywords', '').split(','))
  pdfDoc.setProducer(doc.getAttribute('publisher', ''))
  pdfDoc.setCreator(`(Asciidoctor PDF ${pkg.version})`)
  pdfDoc.setCreationDate(creationDate)
  pdfDoc.setModificationDate(modificationDate)
  return pdfDoc.save()
}

module.exports = {
  addMetadata: addMetadata
}
