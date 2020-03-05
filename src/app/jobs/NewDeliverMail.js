import Mail from '../../lib/Mail';

class NewDeliverMail {
  get key() {
    return 'NewDeliverMail';
  }

  async handle({ data }) {
    const { deliveryman, product, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova encomenda disponível para retirada - FastFeet',
      template: 'newDeliver',
      context: {
        deliveryman: deliveryman.name,
        product,
        recipientName: recipient.name,
        recipientState: recipient.state,
        recipientCity: recipient.city,
        recipientStreet: recipient.street,
        recipientNumber: recipient.number,
        recipientZip: recipient.zip,
      },
    });
  }
}

export default new NewDeliverMail();
