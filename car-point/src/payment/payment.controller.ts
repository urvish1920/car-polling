import {
  Body,
  Controller,
  HttpStatus,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import Stripe from 'stripe';
const stripe = require('stripe')(
  'sk_test_51OrxKrSHTsu5axxCsgCo3kQh9b9sN32mOB8oygwCzxp2AhM1aSrUCDwPzBaIwEy1yU1KrR9An6XNaHboBhExDVpt00dV9w2TqO',
);

@Controller('payment')
export class PaymentController {
  @UseGuards(AuthGuard('jwt'))
  @Post('/order')
  async payment(@Res() res: Response, @Req() req: Request, @Body() body: any) {
    try {
      const { price } = body;
      console.log(price);
      if (typeof price !== 'number' || isNaN(price)) {
        throw new Error('Invalid price value');
      }
      const customer = await stripe.customers.create({
        email: req['user'].email,
      });
      console.log('helloooo', customer);
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        line_items: [
          {
            price_data: {
              currency: 'inr',
              unit_amount: price * 100,
              product_data: {
                name: 'Product Name',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/',
        cancel_url: 'http://localhost:3000/',
      });
      console.log('------------------', req['user']);
      return res.status(HttpStatus.OK).json({ session_id: session.url });

      // const USERID =
    } catch (error: any) {
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Post('/webhook')
  async webhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    let event: Stripe.Event;

    try {
      console.log('hello', req.rawBody);
      event = Stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        'whsec_51782bca1570674ffa7f8f01e0f87af20b3f1bf87595cc82000909ae3bf87e7f',
      );
      console.log('========', req.rawBody);
      if (event?.type === 'checkout.session.completed') {
        const session = event?.data?.object;
        console.log(session);
        const { metadata, mode, payment_intent, invoice } = session;
        console.log('event object', metadata, payment_intent, invoice);
        if (mode === 'payment') {
          // const response = await this.orderService.webhook(
          // metadata,
          // payment_intent,
          // invoice,
          // );
        }

        return res.status(HttpStatus.OK).json({ sucsses: true });
      }
      res.send();
    } catch (error: any) {
      console.log('>>>>>>>>>', error);

      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
