const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'alokperla8055@gmail.com'

export async function sendOrderNotification({
  orderId,
  customerEmail,
  address,
  total,
  items,
  paymentMethod = 'COD',
}: {
  orderId: string
  customerEmail?: string | null
  address: string
  total: number
  items: Array<{ product?: { name?: string }; quantity?: number }>
  paymentMethod?: string
}) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.info('RESEND_API_KEY is not configured. Skipping admin order email notification.')
    return { success: true, skipped: true }
  }

  const itemSummary = items
    .map((item) => `${item.product?.name || 'Product'} × ${item.quantity || 0}`)
    .join('<br />')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'Rajsangmeshwar Textile <onboarding@resend.dev>',
      to: [ADMIN_NOTIFICATION_EMAIL],
      subject: `New order received #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin-bottom: 8px;">New order received</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer:</strong> ${customerEmail || 'Guest'}</p>
          <p><strong>Payment:</strong> ${paymentMethod}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Total:</strong> ₹${total}</p>
          <p><strong>Items:</strong></p>
          <div>${itemSummary || 'No items'}</div>
        </div>
      `,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Email delivery failed: ${text}`)
  }

  return { success: true, skipped: false }
}
