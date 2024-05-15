import {
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
import { error } from 'console';

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
    try {
      if (product) {
        const cart: CreateCartDto = new CreateCartDto();
        cart.productId = createCartDto.productId;
        cart.quantity = createCartDto.quantity;
        cart.userId = userId;
        let cartItem = await this.getCart(userId, createCartDto.productId);
        if (cartItem) {
          cartItem.quantity += createCartDto.quantity;
          return await this.cartRepository.save(cartItem);
        } else return await this.cartRepository.save(cart);
      } else {
        throw new NotFoundException('Product not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('Error creating cart', error);
    }
  }
  async getCart(userId: number, productId: number) {
    const cartItem = await this.cartRepository.findOne({
      where: { userId, productId },
    });
    return cartItem;
  }
  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
