# Missão TI — versão online

Esta versão permite que alunos usem Wi-Fi ou dados móveis (3G/4G/5G), de qualquer
rede. Requer publicação na Vercel e um banco Upstash Redis conectado.
Site público: https://missaoti.vercel.app
Painel: https://missaoti.vercel.app/admin?nova=1
A versão local anterior continua funcionando separadamente, sem internet.

## Publicar

1. Crie um repositório GitHub com o conteúdo desta pasta, sem node_modules,
   dist ou arquivos .env com valores reais.
2. Na Vercel, importe esse repositório como novo projeto. Use o nome missao-ti
   ou outro disponível, framework Other, build `npm run build`, saída `dist`.
3. No Marketplace/Storage do novo projeto, conecte um banco Upstash Redis.
   Confira o plano e os limites mostrados pelo provedor antes de confirmar.
4. Nas variáveis de ambiente do novo projeto, configure:

| Variável | Valor |
|---|---|
| UPSTASH_REDIS_REST_URL | URL REST fornecida pelo banco |
| UPSTASH_REDIS_REST_TOKEN | Token REST fornecido pelo banco, armazenado como segredo |
| PUBLIC_BASE_URL | Endereço HTTPS público final do jogo, sem barra no final |

Não use variáveis NEXT_PUBLIC ou VITE para o token. Ele fica somente no servidor.
Não compartilhe senhas ou tokens em mensagens. O navegador não recebe o token.
O servidor também aceita o par KV_REST_API_URL / KV_REST_API_TOKEN criado pela
integração Upstash no Marketplace da Vercel. Esse par é mapeado no backend para
a mesma conexão REST, sem enviar credenciais ao cliente. Mantenha ambos como
segredos gerenciados. Um par UPSTASH_* completo tem prioridade; não misture URL
de um banco com token de outro. Nunca use KV_REST_API_READ_ONLY_TOKEN para gravar.

O projeto missaoti utiliza o banco dedicado missaoti-redis no plano Free,
com PUBLIC_BASE_URL=https://missaoti.vercel.app em produção. Confira os limites
atuais na integração antes de uma atividade e não habilite um plano pago sem
autorização.

5. Publique novamente após configurar as variáveis. A URL de produção precisa
   permitir visitantes sem conta Vercel: confirme a configuração de proteção do
   novo projeto para a produção, preservando a proteção de outros projetos.
6. Abra `https://SEU-DOMINIO/admin?nova=1` e crie a turma. A URL do QR Code
   é gerada automaticamente com o endereço público. Abra o telão em outra aba.
7. Teste no celular com Wi-Fi desligado e dados móveis ligados: entrar, responder
   e conferir o ranking no PC. Esse teste externo é obrigatório antes da atividade.

## Operação

O apresentador precisa de internet para controlar a versão online. Os alunos
podem usar redes diferentes. Todos utilizam a mesma sala no endereço público.
O PC não precisa hospedar o servidor online, mas precisa ficar ligado para projetar.

As regras, oito personagens e início automático são iguais à versão local V4.
O QR não aparece no ranking do navegador do aluno que já terminou. A sala expira
24 horas após a última alteração (entrada, resposta ou comando do apresentador).
Cada sala admite até 150 jogadores; esse número ainda requer teste de carga real.
Respostas são pontuadas no servidor, com atualização atômica no Redis, para evitar
perda de atualizações concorrentes e duplicação de XP no reenvio de respostas.

O painel de controle fica no navegador que criou a sala. Use um navegador próprio.
Para limpar dados, exclua apenas as chaves missao-ti:room:* no banco deste projeto,
ou aguarde a expiração. Não use um banco compartilhado com outros sistemas sem
entender a separação por prefixo. As salas não coletam nome completo ou telefone.

## Validação desta entrega

Sintaxe e build verificados. Testes com Redis simulado confirmaram entrada
simultânea sem perda de jogadores, reenvio de respostas sem duplicação de XP,
pontuação final, autorização dos controles, URL pública e fechamento da sala.
Publicação, Redis real, teste de carga e acesso por dados móveis ainda pendentes.
