import type { Request, Response } from 'express'
import type { Context } from '.keystone/types'


export async function postContact (req: Request, res: Response, context: Context) {
  // Now we can use it to query the Keystone Schema
 const body= req.body;
 console.log(body);
 const date = new Date();

  const formattedDate = date.toISOString().split('T')[0];
  const { name, email, phone, enquiryType, message } = body;

  try {
    if (!name || !email || !phone || !enquiryType || !message) {
      return res.status(400).json({ error: 'Please fill in all fields' })
    }

    const contact = await context.query.Message.createOne({
      data: {
        name: name,
        email: email,
        phone: phone,
        enquiryType: enquiryType,
        message: message,
        date: formattedDate
      },
    })

    res.status(201).json(contact)
  }

  catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong' })
  }

}