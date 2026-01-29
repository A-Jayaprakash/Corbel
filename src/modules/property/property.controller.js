import {
  createProperty,
  getPropertiesByOwner,
  deleteProperty,
} from "./property.service.js";

/**
 * Create Property Controller
 */
export const createPropertyController = async (req, res, next) => {
  try {
    const { name, address } = req.body;
    const ownerId = req.owner.id;

    const property = await createProperty({
      ownerId,
      name,
      address,
    });

    return res.status(201).json({
      id: property._id,
      name: property.name,
      address: property.address,
      createdAt: property.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Properties Controller
 */
export const getPropertiesController = async (req, res, next) => {
  try {
    const ownerId = req.owner.id;

    const properties = await getPropertiesByOwner({ ownerId });

    const response = properties.map((property) => ({
      id: property._id,
      name: property.name,
      address: property.address,
    }));

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Property Controller
 */
export const deletePropertyController = async (req, res, next) => {
  try {
    const ownerId = req.owner.id;
    const { propertyId } = req.params;

    await deleteProperty({ ownerId, propertyId });

    return res.status(200).json({
      message: "Property deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
