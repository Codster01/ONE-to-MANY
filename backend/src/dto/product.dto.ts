import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Product Name',
  })
  readonly name: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'Product Description',
  })
  readonly description: string;

  @ApiProperty({
    description: 'The selling price of the product',
    example: 100,
  })
  readonly sellingPrice: number;

  @ApiProperty({
    description: 'The actual price of the product',
    example: 120,
  })
  readonly actualPrice: number;

  @ApiProperty({
    description: 'Tags associated with the product',
    example: 'tag1, tag2',
  })
  readonly tags: string;

  @ApiProperty({
    description: 'The category of the product',
    example: 'Category Name',
  })
  readonly category: string;
}