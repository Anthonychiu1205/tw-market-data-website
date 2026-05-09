import { TWMDClient } from "./client.js";

type SharedInput = {
  symbol: string;
  limit?: number;
  start_date?: string;
  end_date?: string;
};

type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, { type: string; description: string }>;
    required: string[];
  };
  call: (client: TWMDClient, input: Record<string, unknown>) => Promise<unknown>;
};

function asSharedInput(input: Record<string, unknown>): SharedInput {
  return {
    symbol: String(input.symbol || ""),
    limit: input.limit === undefined ? undefined : Number(input.limit),
    start_date: input.start_date === undefined ? undefined : String(input.start_date),
    end_date: input.end_date === undefined ? undefined : String(input.end_date),
  };
}

const sharedProperties = {
  symbol: { type: "string", description: "台股代號，例如 2330" },
  limit: { type: "number", description: "回傳筆數上限（可選）" },
  start_date: { type: "string", description: "起始日期 YYYY-MM-DD（可選）" },
  end_date: { type: "string", description: "結束日期 YYYY-MM-DD（可選）" },
};

export const toolDefinitions: ToolDefinition[] = [
  {
    name: "get_twse_daily_price",
    description: "查詢 TWSE 日線價格資料",
    inputSchema: { type: "object", properties: sharedProperties, required: ["symbol"] },
    call: async (client, input) => {
      const params = asSharedInput(input);
      return client.getDataset("twse-daily-price", params);
    },
  },
  {
    name: "get_tpex_daily_price",
    description: "查詢 TPEx 日線價格資料",
    inputSchema: { type: "object", properties: sharedProperties, required: ["symbol"] },
    call: async (client, input) => {
      const params = asSharedInput(input);
      return client.getDataset("tpex-daily-price", params);
    },
  },
  {
    name: "get_issuer_profile",
    description: "查詢公司基本資料",
    inputSchema: {
      type: "object",
      properties: {
        symbol: { type: "string", description: "台股代號，例如 2330" },
      },
      required: ["symbol"],
    },
    call: async (client, input) => {
      return client.getDataset("issuer-profile", { symbol: String(input.symbol || "") });
    },
  },
  {
    name: "get_monthly_revenue",
    description: "查詢月營收資料",
    inputSchema: { type: "object", properties: sharedProperties, required: ["symbol"] },
    call: async (client, input) => {
      const params = asSharedInput(input);
      return client.getDataset("monthly-revenue", { symbol: params.symbol, limit: params.limit });
    },
  },
  {
    name: "get_valuation_data",
    description: "查詢估值資料",
    inputSchema: { type: "object", properties: sharedProperties, required: ["symbol"] },
    call: async (client, input) => {
      const params = asSharedInput(input);
      return client.getDataset("valuation-data", { symbol: params.symbol, limit: params.limit });
    },
  },
  {
    name: "get_technical_indicators",
    description: "查詢技術指標資料",
    inputSchema: { type: "object", properties: sharedProperties, required: ["symbol"] },
    call: async (client, input) => {
      const params = asSharedInput(input);
      return client.getDataset("technical-indicators", { symbol: params.symbol, limit: params.limit });
    },
  },
];

export function getToolByName(name: string) {
  return toolDefinitions.find((tool) => tool.name === name) || null;
}
