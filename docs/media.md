# Imagens dos projetos

As imagens e os vídeos em `public/projects/` foram capturados com Playwright, usando as aplicações em execução. As capas têm versões de 1600 × 900 e 800 × 450. Os vídeos WebM têm cerca de seis segundos e não contêm áudio.

| Projeto             | Fonte                                                                                                                                                              | Ambiente e dados                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| STACK10             | [stack10](https://github.com/pedrobicas/stack10), `2507fed`                                                                                                        | Demo pública em stack10.pedrobicas.com; partida com teclado e controles touch.                            |
| Faxina              | [faxina](https://github.com/pedrobicas/faxina), `861554a`                                                                                                          | Execução local; pasta fictícia criada no disco e analisada pelo programa. Caminhos locais ocultados.      |
| Crypto Analysis     | [crypto-platform](https://github.com/pedrobicas/crypto-platform), `20d7f20`                                                                                        | Modo demonstração nativo, com preços sintéticos e indicadores calculados pelo app.                        |
| Chat em tempo real  | [java-realtime-chat](https://github.com/pedrobicas/java-realtime-chat), `05482fb`; [web-realtime-chat](https://github.com/pedrobicas/web-realtime-chat), `4f2e0f5` | Front e servidor locais; mensagens públicas e privadas entre três perfis fictícios.                       |
| My Spotify Universe | [my-universe-spotify](https://github.com/pedrobicas/my-universe-spotify), `25e325a`                                                                                | Modo demo oficial da implantação pública, com catálogo fictício. OAuth e streaming real não foram usados. |
| Postlocal           | [postlocal](https://github.com/pedrobicas/postlocal), `5be8b6e`                                                                                                    | Páginas públicas do frontend local. Autenticação, geração de conteúdo e pagamentos não foram exercitados. |

Os commits identificam os repositórios consultados. Nas demos públicas, a versão publicada pode diferir desses commits. Nenhuma interface foi recriada ou modificada para a captura.

As referências usadas pelo site estão em `src/data/projectMedia.js`. Ao trocar uma mídia, atualize o caminho, as dimensões e a legenda nesse arquivo. Os loops carregam após interação e respeitam `prefers-reduced-motion`.
