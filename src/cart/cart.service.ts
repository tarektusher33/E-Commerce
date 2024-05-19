import {
  BadRequestException,
  ConsoleLogger,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';

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
  ): Promise<Cart> {
    const product = await this.productService.findOne(createCartDto.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.quantity < createCartDto.quantity) {
      throw new UnauthorizedException(
        `You cannot add ${createCartDto.quantity} items because there are only ${product.quantity} items available. Please enter a valid quantity.`,
      );
    }
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['products'],
    });
    if (cart) {
      const existingProduct = cart.products.find(
        (p) => p.id === createCartDto.productId,
      );
      if (existingProduct) {
        existingProduct.quantity += createCartDto.quantity;
        existingProduct.price += createCartDto.quantity * product.price;
      } else {
        product.quantity = createCartDto.quantity;
        cart.products.push(product);
      }
      cart.quantity += createCartDto.quantity;
      cart.price += createCartDto.quantity * product.price;
    } else {
      cart = new Cart();
      cart.userId = userId;
      product.quantity = createCartDto.quantity;
      cart.products = [product];
      cart.quantity = createCartDto.quantity;
      cart.price = createCartDto.quantity * product.price;
    }
    try {
      return await this.cartRepository.save(cart);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating cart',
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

  async updateCart(id: number, updateCartDto: UpdateCartDto) {
    try {
      if (updateCartDto.quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than zero');
      }
      const product = await this.productService.findOne(
        updateCartDto.productId,
      );
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      const toUpdateCart: Cart = await this.cartRepository.findOne({
        where: { id },
        relations: ['products'],
      });
      if (!toUpdateCart) {
        throw new NotFoundException('Cart not found');
      }
      toUpdateCart.quantity = updateCartDto.quantity;
      toUpdateCart.price = product.price * updateCartDto.quantity;
      return await this.cartRepository.save(toUpdateCart);
    } catch (error) {
      throw new InternalServerErrorException('Error updating cart', error);
    }
  }

  async removeCart(cartId: number, userId: number) {
    // Find the cart belonging to the user with the specified product
    const cart = await this.cartRepository.findOne({
      where: { id: cartId, userId },
      relations: ['products'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Delete the cart
    await this.cartRepository.remove(cart);

    return {
      message: 'Successfully removed item from your cart',
    };
}


  async findAllCarts() {
    return this.cartRepository.find();
  }
  async removeItemFromCart(
    removeCartDto: CreateCartDto,
    id: number,
    userId: number,
  ) {
    if (removeCartDto.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }
    const product = await this.productService.findOne(removeCartDto.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const cartItem = await this.cartRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    if (userId !== cartItem.userId) {
      throw new NotFoundException('Cart item not found');
    }
    if (removeCartDto.quantity > cartItem.quantity) {
      throw new BadRequestException(
        `Cannot remove ${removeCartDto.quantity} items because there are only ${cartItem.quantity} items in the cart`,
      );
    }
    cartItem.quantity -= removeCartDto.quantity;
    cartItem.price -= removeCartDto.quantity * product.price;
    if (cartItem.quantity === 0) {
      await this.cartRepository.delete(id);
    } else {
      await this.cartRepository.save(cartItem);
    }
    return {
      message: 'Successfully removed item from your cart',
    };
  }
}
