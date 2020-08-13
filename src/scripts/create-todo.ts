// 3p
import { createConnection } from 'typeorm';

import { Todo } from '../app/entities'

export const schema = {
  additionalProperties: false,
  properties: {
    text: { type: 'string' }
  },
  required: ['text'],
  type: 'object',
};

export async function main(args: any) {
  const connection = await createConnection();

  try {
    const todo = new Todo()
    todo.text = args.text
    console.log(
      await connection.manager.save(todo)
    )
  } catch (error) {
    console.log(error.message)
  } finally {
    await connection.close()
  }
}