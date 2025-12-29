import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) {}

    async createPost(createPostDto: CreatePostDto, username: string) {
        const user = await this.prisma.users.findUnique({
            where: { username},
        })
        if (!user){
            throw new Error('User not found');
        }
        return this.prisma.post.create({
            data: {
                content: createPostDto.content,
                imageUrl: createPostDto.imageId,
                authorId: BigInt(user.id),
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

    async updatePost(id: number, updatePostDto: UpdatePostDto, userId: number) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        })
        if (!post || post.authorId !== BigInt(userId)){
            throw new Error('Post not found or unauthorized');
        }
        return this.prisma.post.update({
            where: {id},
            data: {
                content: updatePostDto.content,
                title: updatePostDto.title,
                imageUrl: updatePostDto.imageId,
            }
        });
    }

    async deletePost(id: number, userId: number){
        const post = await this.prisma.post.findUnique({
            where: { id },
        })
        if (!post || post.authorId !== BigInt(userId)){
            throw new Error('Post not found or unauthorized');
        }
        return this.prisma.post.delete({
            where: {id}
        })
    }
}
