import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificacionesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Obtener el user_id de la URL
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.user_group_name = f'user_{self.user_id}'

        # Unirse al grupo del usuario
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"✅ Usuario {self.user_id} conectado a notificaciones WebSocket")

    async def disconnect(self, close_code):
        # Salir del grupo del usuario
        await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
        )
        print(f"❌ Usuario {self.user_id} desconectado de notificaciones WebSocket")

    # Recibir mensaje del grupo
    async def notificacion_postulacion(self, event):
        # Enviar mensaje al WebSocket
        await self.send(text_data=json.dumps({
            'tipo': event['tipo'],
            'mensaje': event['mensaje'],
            'oferta_titulo': event['oferta_titulo'],
            'estado': event['estado'],
            'timestamp': event.get('timestamp')
        })) 