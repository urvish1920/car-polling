import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
const stripe = require('stripe')(
  'sk_test_51OrxKrSHTsu5axxCsgCo3kQh9b9sN32mOB8oygwCzxp2AhM1aSrUCDwPzBaIwEy1yU1KrR9An6XNaHboBhExDVpt00dV9w2TqO',
);

@Controller('payment')
export class PaymentController {
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async payment(@Res() res: Response, @Req() req: Request, @Body() body: any) {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd', // Change currency as needed
              unit_amount: 10 * 100, // Price in cents ($10 in this case)
              product_data: {
                name: 'Product Name', // Name of your product
                // Add more product details if needed
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
}
