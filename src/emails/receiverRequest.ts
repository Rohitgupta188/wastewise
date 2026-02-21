type ReceiverRequestEmailProps = {
  donorName: string;
  receiverName: string;
  foodName: string;
  quantity: number;
};

export function receiverRequestEmail({
  donorName,
  receiverName,
  foodName,
  quantity,
}: ReceiverRequestEmailProps) {
  return {
    subject: "New Food Request Received",
    html: `
      <h2>Hello ${donorName},</h2>
      <p><strong>${receiverName}</strong> has requested:</p>
      <ul>
        <li>Food: ${foodName}</li>
        <li>Quantity: ${quantity}</li>
      </ul>
      <p>Please log in to respond.</p>
    `,
    text: `${receiverName} requested ${quantity} of ${foodName}`,
  };
}
