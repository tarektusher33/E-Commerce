import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from '../product/product.service';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { createResponse } from 'src/utils/response.util';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly productService: ProductService,
  ) {}

  async createCart(
    createCartDto: CreateCartDto,
    userId: number,
  ): Promise<ApiResponse<Cart | null>> {
    const product = await this.productService.findOne(createCartDto.productId);
    if (!product) {
      return createResponse<null>(
        null,
        `Product not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (product.stockQuantity < createCartDto.quantity) {
      return createResponse<null>(
        null,
        `You cannot add ${createCartDto.quantity} items because there are only ${product.stockQuantity}
         items available. Please enter a valid quantity.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    let cart = await this.cartRepository.findOne({
      where: { userId, productId: createCartDto.productId },
      relations: ['products'],
    });
    if (cart) {
      const existingProduct = cart.products.find(
        (p) => p.id === createCartDto.productId,
      );
      if (existingProduct) {
        existingProduct.stockQuantity += createCartDto.quantity;
        existingProduct.price += createCartDto.quantity * product.price;
      } else {
        cart.products.push(product);
      }
      cart.quantity += createCartDto.quantity;
      cart.price += createCartDto.quantity * product.price;
    } else {
      cart = new Cart();
      cart.userId = userId;
      cart.productId = createCartDto.productId;
      cart.products = [product];
      cart.quantity = createCartDto.quantity;
      cart.price = createCartDto.quantity * product.price;
    }
    try {
      await this.cartRepository.save(cart);
      return createResponse<Cart>(
        cart,
        'Product added in the cart',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return createResponse<null>(
        null,
        'Error creating cart',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  async getCart(userId: number, productId: number): Promise<Cart> {
    const cartItem = await this.cartRepository.findOne({
      where: { userId },
      relations: ['products'],
    });
    return cartItem;
  }

  async updateCart(
    id: number,
    updateCartDto: UpdateCartDto,
  ): Promise<ApiResponse<Cart | null>> {
    try {
      if (updateCartDto.quantity <= 0) {
        return createResponse<null>(
          null,
          'Quantity must be greater than zero',
          HttpStatus.BAD_REQUEST,
        );
      }
      const product = await this.productService.findOne(
        updateCartDto.productId,
      );
      if (!product) {
        return createResponse<null>(
          null,
          'Product not found',
          HttpStatus.NOT_FOUND,
        );
      }
      const toUpdateCart: Cart = await this.cartRepository.findOne({
        where: { id },
        relations: ['products'],
      });
      if (!toUpdateCart) {
        return createResponse<null>(
          null,
          'Cart not found',
          HttpStatus.NOT_FOUND,
        );
      }
      toUpdateCart.quantity = updateCartDto.quantity;
      toUpdateCart.price = product.price * updateCartDto.quantity;
      await this.cartRepository.save(toUpdateCart);
      return createResponse<Cart>(
        toUpdateCart,
        'Cart updated successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return createResponse<Cart>(
        null,
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeCart(
    cartId: number,
    userId: number,
  ): Promise<ApiResponse<Cart | null>> {
    try {
      const cart = await this.cartRepository.findOne({
        where: { id: cartId, userId },
        relations: ['products'],
      });
      if (!cart) {
        return createResponse<null>(
          null,
          'Cart not found',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.cartRepository.remove(cart);
      return createResponse<Cart>(
        cart,
        'Cart Removed Successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return createResponse<null>(
        null,
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  async findAllCarts(userId: number): Promise<ApiResponse<Cart[] | null>> {
    try {
      const carts = await this.cartRepository.find({
        where: { userId },
        relations: ['products'],
      });
      if (carts) {
        return createResponse<Cart[]>(
          carts,
          'Carts found Successfully',
          HttpStatus.OK,
        );
      } else {
        return createResponse<null>(
          null,
          'Cart not found',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      return createResponse<null>(
        null,
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

}
