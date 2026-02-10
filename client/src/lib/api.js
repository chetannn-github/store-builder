import { BASE_URL } from "./constant";


async function handleRes(res) {
  try {
    let result = await res.json();
    return result;
  } catch (error) {
    
  }
  
}

async function get(path, token) {
  const headers = {}
  if (token) headers['Authorization'] = 'Bearer ' + token
  const res = await fetch(BASE_URL + path, { headers})
  return await handleRes(res)
}

async function post(path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = 'Bearer ' + token
  const res = await fetch(BASE_URL + path, { method: 'POST', headers, body: JSON.stringify(body)})
  return await handleRes(res)
}

async function put(path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = 'Bearer ' + token
  const res = await fetch(BASE_URL + path, { method: 'PUT', headers, body: JSON.stringify(body) })
  return await handleRes(res)
}

async function del(path ,body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = 'Bearer ' + token
  const res = await fetch(BASE_URL + path, { method: 'DELETE', headers, body : JSON.stringify(body)})
  return await handleRes(res)
}


async function patch(path, token) {
  const headers = {}
  if (token) headers['Authorization'] = 'Bearer ' + token
  const res = await fetch(BASE_URL + path, { method: 'PATCH', headers})
  return await handleRes(res)
}

export default { get, post, patch , del, put}