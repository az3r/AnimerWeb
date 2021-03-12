import { auth } from '@services/firebase';
import { authenticate } from '@services/api';
import { NextApiRequest, NextApiResponse } from 'next';
import home from '@utils/urls';
import log from '@utils/logging';

export default async function handler(
  { query }: NextApiRequest,
  response: NextApiResponse
) {
  const state = query.state as string;
  const code = query.code as string;

  try {
    const { codeVerifier } = await auth.get(state);
    const token = await authenticate.token(code, codeVerifier);
    await auth.create(state, codeVerifier, codeVerifier, token);
    response.redirect(200, `${home}`);
  } catch (error) {
    log.error(error);
    response.status(500).json({ error });
  }
}
