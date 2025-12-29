import { PrismaModule } from "src/prisma/prisma.module";
import { ChatGateway } from "./chat.gateway";
import { Module } from "@nestjs/common";
import { ChatService } from './chat.service';
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [PrismaModule, AuthModule],
    providers: [ChatGateway, ChatService],
})

export class ChatModule {}