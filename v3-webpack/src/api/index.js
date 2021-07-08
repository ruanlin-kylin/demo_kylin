import request from '@/utils/request';

export function getHospitalConfig() {
  return request({
    url: '/hospitalConfig/get',
    method: 'get',
  });
}
