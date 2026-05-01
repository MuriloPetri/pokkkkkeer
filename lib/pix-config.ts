// ============================================================
//  CONFIGURAÇÃO PIX — Troque apenas as variáveis abaixo
// ============================================================

/**
 * Chave PIX do recebedor.
 * Pode ser: CPF, CNPJ, e-mail, telefone (+55...) ou chave aleatória.
 * Exemplo: "11999990000"  |  "meuemail@gmail.com"  |  "a1b2c3d4-..."
 */
export const PIX_KEY = "murilomauriciopetri@gmail.com"

/**
 * Nome que aparece na tela do app bancário do pagador.
 * Máximo 25 caracteres.
 */
export const PIX_RECEIVER_NAME = "Poker Trainer"

/**
 * Cidade do recebedor (exigido pelo payload PIX estático).
 */
export const PIX_CITY = "Maraba"

/**
 * Valor cobrado em reais (número).
 */
export const PIX_AMOUNT = 6.0

/**
 * Valor formatado para exibição (string).
 */
export const PIX_AMOUNT_DISPLAY = "6,00"

/**
 * URL da imagem do QR Code gerado para sua chave PIX.
 * Gere em: https://gerarqrcodepix.com.br/ ou via sua conta bancária.
 * Cole aqui a URL da imagem, ou coloque o arquivo em /public/qrcode-pix.png
 * e use "/qrcode-pix.png".
 *
 * Deixe como string vazia "" para mostrar apenas a chave sem QR Code.
 */
export const PIX_QRCODE_URL = "/qrcode-pix.png"

/**
 * Identificador do produto/acesso liberado.
 */
export const PRODUCT_NAME = "Treinador de Poker Premium"

/**
 * Chave de localStorage usada para guardar o estado de acesso pago.
 * Não precisa trocar.
 */
export const STORAGE_KEY = "poker_trainer_paid_v1"
