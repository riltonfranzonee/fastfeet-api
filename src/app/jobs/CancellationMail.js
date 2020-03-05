import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { deliveryman, product, deliveryId, reason } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: `Encomenda ${deliveryId} cancelada - FastFeet`,
      template: 'Cancellation',
      context: {
        deliveryman: deliveryman.name,
        product,
        deliveryId,
        reason,
      },
    });
  }
}

export default new CancellationMail();
