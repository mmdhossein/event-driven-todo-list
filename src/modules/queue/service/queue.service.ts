import {ClientProxy} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {firstValueFrom} from "rxjs";
import {StringCodec} from "nats";
import * as nats from "ts-nats";

export abstract class TransportService {
    abstract publishMessage(pattern: string, data: any)
}

@Injectable()
export class QueueNatsService implements TransportService {
    constructor(
        @Inject('NATS_SERVICE') private readonly client: ClientProxy,

    ) {


    }

    public async publishMessage(pattern: string, data: any): Promise<void> {
        const result = await firstValueFrom(this.client.send('test','321'));
        console.log("sending...", pattern, data)
        console.log(result)
    }
}

@Injectable()
export class QueueService {
    nc
    sc

    constructor(@Inject(QueueNatsService) private transportService: TransportService) {
         nats.connect({
            servers: ["nats://localhost:4222"],reconnect:true
        }).then((nc)=> {
             this.nc = nc
         });
        this.sc =  StringCodec()


    }

   async publishMessage(pattern: string, data: Object) {
       await this.nc.publish(pattern, this.sc.encode(JSON.stringify(data), 'todo'));

       // await this.transportService.publishMessage(pattern, data)
    }
}