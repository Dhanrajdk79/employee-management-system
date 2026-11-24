
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];
  private nextId = 1;

  async create(
    name: string,
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const existingUser = this.users.find(
      (user) => user.email === email,
    );

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: this.nextId++,
      name,
      email,
      password: hashedPassword,
      role: 'employee',
    };

    this.users.push(newUser);

    const { password: _, ...safeUser } = newUser;
    return safeUser;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async findById(id: number): Promise<Omit<User, 'password'>> {
    const user = this.users.find((item) => item.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}
