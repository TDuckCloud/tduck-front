import store from '@/store/index'

export function getToken() {
  return store.state.user.token
}
