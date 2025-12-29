import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) { }

    async createPost(createPostDto: CreatePostDto, userIdFromToken: string) {
        return this.prisma.post.create({
            data: {
                content: createPostDto.content,
                imageUrl: createPostDto.imageId,
                authorId: BigInt(userIdFromToken),
                title: createPostDto.title,
            },
        });
    }

    async getFeed() {
        return this.prisma.post.findMany({
            include: {
                author: {
                    select: {
                        username: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

    async updatePost(id: number, updatePostDto: UpdatePostDto, userIdFromToken: string) {
        const post = await this.prisma.post.findUnique({
            where: { id: Number(id) },
        })
        if (!post || post.authorId !== BigInt(userIdFromToken)) {
            throw new ForbiddenException('You are not authorized to update this post');
        }
        return this.prisma.post.update({
            where: { id: Number(id) },
            data: {
                content: updatePostDto.content,
                title: updatePostDto.title,
                imageUrl: updatePostDto.imageId,
            }
        });
    }

    async deletePost(id: number, userIdFromToken: string) {
        const post = await this.prisma.post.findUnique({
            where: { id: Number(id) },
        })
        if (!post || post.authorId !== BigInt(userIdFromToken)) {
            throw new ForbiddenException('You are not authorized to delete this post');
        }
        return this.prisma.post.delete({
            where: { id: Number(id) }
        })
    }
}
