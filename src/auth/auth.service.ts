import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(signUpDto: any) {
    try {
      const { name, email, password, phoneNumber } = signUpDto;
      // Check if the user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new Error('User already exists');
      }
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.prisma.user.create({
        data: {
          name,
          email,
          phoneNumber,
          password: hashedPassword, 
        },
      });
      return newUser;
    } catch (error) {
      throw error;
    }
  }
}
