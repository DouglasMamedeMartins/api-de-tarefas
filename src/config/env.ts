export function getEnv(env: string): string {
  const value = process.env[env];
  if (!value) {
    throw new Error(`A variável ${env} não informado`);
  }
  return value;
}

export function getEnvNumber(env: string): number {
  const value = getEnv(env);
  const numberValue = Number(value);

  if (Number.isNaN(numberValue) || !Number.isInteger(numberValue)) {
    throw new Error(
      `A variável ${env} precisa ser um número ou um número inteiro`,
    );
  }
  if (numberValue <= 0 || numberValue > 65535) {
    throw new Error(`A variável ${env} precisa ser um inteiro entre 1 e 65535`);
  }
  return numberValue;
}
