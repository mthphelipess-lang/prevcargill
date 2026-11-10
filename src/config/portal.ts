import bannerImage from "@/assets/images/banner-industrial.jpg";
import logoCargill from "@/assets/logo-cargill.webp.asset.json";

export const portalConfig = {
  name: "Logística Recebimento 4.0",
  /** Caminho do logotipo oficial. null = exibe placeholder "LOGO". */
  logoUrl: logoCargill.url as string | null,
  logoAlt: "Logotipo da Cargill",
  bannerImage,
  bannerAlt: "Unidade industrial com silos e caminhões na área de recebimento",
  // PLACEHOLDER: validar e-mail e telefone oficiais antes da publicação.
  supportLabel: "Suporte",
  supportEmail: "logistica.recebimento@empresa.com",
  supportPhone: "(00) 0000-0000",
};
