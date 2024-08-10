'use server'

import { signIn } from '../next-auth'

export async function signInAction() {
  await signIn()
}
