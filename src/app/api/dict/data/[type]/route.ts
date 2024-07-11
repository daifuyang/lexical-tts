import { trim } from "lodash";
import { NextRequest } from "next/server";
import api from "@/lib/response";
import { getSystemDictDataList } from "@/model/systemDictData";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest, { params }: { params: { type: string } }) {
   
    const { type } = params;
    const { searchParams } = request.nextUrl;
   
    const where: Prisma.sysDictDataWhereInput = {
      type
    };
  
    const label = searchParams.get("label") || "";
    if (trim(label)) {
      where.label = label;
    }
    const value = searchParams.get("value") || "";
    if (trim(value)) {
      where.value = value;
    }
  
    const status = searchParams.get("status") || "";
    if (trim(status)) {
      where.status = Number(status);
    }
  
    const list = await getSystemDictDataList({
      where
    });
    return api.success("获取成功！", list);
  }