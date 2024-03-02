import { Client } from "@stomp/stompjs";

interface Subscription {
  topic: string;
  callback: any;
}

class WebSocketService {
  private client: Client;
  private subscriptions: Map<string, any> = new Map();
  private pendingSubscriptions: Subscription[] = [];

  constructor() {
    this.client = new Client({
      brokerURL: process.env.WEBSOCKET_URL,
      connectHeaders: {
        login: process.env.WEBSOCKET_USERNAME ?? "guest",
        passcode: process.env.WEBSOCKET_PASSWORD ?? "guest",
      },

      debug: function (message) {
        console.log("STOMP: " + message);
      },

      reconnectDelay: process.env.RECONNECT_INTERVAL as unknown as number,
      heartbeatIncoming: process.env.HEARTBEAT_INTERVAL as unknown as number,
      heartbeatOutgoing: process.env.HEARTBEAT_INTERVAL as unknown as number,
    });

    this.client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    this.client.onConnect = () => {
      this.pendingSubscriptions.forEach(({ topic, callback }) => {
        this.subscribeToTopic(topic, callback);
      });
      this.pendingSubscriptions = [];
    };
  }

  public subscribeToTopic(topic: string, callback: any) {
    if (!this.client.active) {
      this.pendingSubscriptions.push({ topic, callback });
      return;
    }

    const subscription = this.client.subscribe(topic, (message) => {
      const messageBody = JSON.parse(JSON.stringify(message.body));
      callback(messageBody);
    });

    this.subscriptions.set(topic, subscription);
  }

  public unsubscribeFromTopic(topic: string) {
    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
    }
  }

  public setOnConnectCallback(callback: () => void) {
    this.client.onConnect = callback;
  }

  public setOnDisconnectCallback(callback: () => void) {
    this.client.onDisconnect = callback;
  }

  public connect() {
    this.client.activate();
  }

  public disconnect() {
    if (this.client.active) {
      this.client.deactivate();
    }
  }
}

export const webSocketService = new WebSocketService();
