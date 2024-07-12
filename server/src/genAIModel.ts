import { AzureChatOpenAI } from '@langchain/openai';

import { logger } from './logger';

export class GenAIModel {
  model?: AzureChatOpenAI;

  constructor() {
    logger.info('Initializing AI model...');
    /**
     * To use AzureChatOpenAI constructor you should have the environment variables set:
     * `AZURE_OPENAI_API_INSTANCE_NAME`, // `https://<AZURE_OPENAI_API_INSTANCE_NAME>.openai.azure.com/`
     * `AZURE_OPENAI_API_KEY`,
     * `AZURE_OPENAI_API_DEPLOYMENT_NAME`,
     * `AZURE_OPENAI_API_VERSION` // https://learn.microsoft.com/en-us/azure/ai-services/openai/api-version-deprecation
     */
    this.model = new AzureChatOpenAI({
      modelName:
        process.env.AZURE_OPENAI_API_MODEL_NAME || 'gpt-3.5-turbo-0613',
      temperature: 0.7,
      maxTokens: 1000,
      maxRetries: 5,
    });
    logger.info('OpenAI model initialized', {
      modelName: this.model.modelName,
      temperature: this.model.temperature,
      maxTokens: this.model.maxTokens,
      azureOpenAIApiVersion: this.model.maxTokens,
    });
  }

  generate = async (userPrompt: string) => {
    if (!this.model) {
      throw new Error('AI model is not initialized');
    }

    logger.info('User prompt', { userPrompt });
    logger.info('Generating AI response...');
    const structuredModel = this.model.withStructuredOutput({
      timeout: 10000,
      name: 'chat',
      description: 'Chat with the AI model',
      parameters: {
        title: 'Chat',
        type: 'object',
        properties: {
          modelResponse: { type: 'string', description: 'The model response' },
          numberOfTokens: {
            type: 'number',
            description: 'The number of tokens',
          },
        },
        required: ['modelResponse', 'numberOfTokens'],
      },
    });
    // const response = await this.model.generate(["Tell me a joke."]);
    const response = await structuredModel.invoke(userPrompt);
    logger.info('AI response generated', { response });
    return response;
  };
}
