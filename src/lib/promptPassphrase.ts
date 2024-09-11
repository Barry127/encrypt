import prompt from 'prompts';

export async function promptPassphrase(
  validate: boolean = false
): Promise<string> {
  const result = await prompt(
    {
      type: 'invisible',
      name: 'passphrase',
      message: 'Passphrase',
      validate: (passphrase: string) =>
        passphrase.length > 0 || 'Passphrase is required'
    },
    {
      onCancel: () => process.exit()
    }
  );

  if (validate)
    await prompt(
      {
        type: 'invisible',
        name: 'passphrase',
        message: 'Confirm passphrase',
        validate: (passphrase: string) =>
          passphrase === result.passphrase || 'Passphrases do not match'
      },
      {
        onCancel: () => process.exit()
      }
    );

  return result.passphrase;
}
