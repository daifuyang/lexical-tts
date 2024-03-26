import request from '@/utils/request'

export function getCurrentMember() {
  return request.get("/api/member/current")
}
