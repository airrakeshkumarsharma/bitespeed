import { Request, Response } from 'express';
import ContactModel from '../models/contact';
import { Op } from 'sequelize';

class ContactCtrl {
    private determinePrimaryContact(contacts: ContactModel[]): ContactModel {
        console.log('contacts', contacts);
        const primaryContact = contacts.find(c => c.linkedId === null && c.linkPrecedence === 'primary');

        // This is a temporary solution to handle the case where there are multiple primary contacts
        if (!primaryContact) {
            return contacts.reduce((prev, current) => prev.createdAt < current.createdAt ? prev : current);
        }

        return primaryContact;
    }

    private async linkContacts(primaryContact: ContactModel, existingContacts: ContactModel[], email?: string, phoneNumber?: string): Promise<void> {
        const secondaryContacts = existingContacts.filter(c => c.id !== primaryContact.id);

        for (const contact of secondaryContacts) {
            if (contact.linkedId !== primaryContact.id) {
                await contact.update({ linkedId: primaryContact.id, linkPrecedence: 'secondary' });
            }
        }

        if ((email && !existingContacts.some(c => c.email === email)) || (phoneNumber && !existingContacts.some(c => c.phoneNumber === phoneNumber))) {
            await ContactModel.create({
                email,
                phoneNumber,
                linkedId: primaryContact.id,
                linkPrecedence: 'secondary'
            });
        }
    }

    private async constructResponse(primaryContact: ContactModel): Promise<any> {
        const secondaryContacts = await ContactModel.findAll({
            where: { linkedId: primaryContact.id }
        });

        const emails = [primaryContact.email, ...secondaryContacts.map(c => c.email).filter(e => e !== null)];
        const phoneNumbers = [primaryContact.phoneNumber, ...secondaryContacts.map(c => c.phoneNumber).filter(p => p !== null)];
        const secondaryContactIds = secondaryContacts.map(c => c.id);

        return {
            contact: {
                primaryContactId: primaryContact.id,
                emails,
                phoneNumbers,
                secondaryContactIds
            }
        };
    }

    async identifyAndLinkContact(req: Request, res: Response): Promise<void> {
        const { email, phoneNumber } = req.body;

        try {
            const existingContacts = (await ContactModel.findAll({
                where: {
                    [Op.or]: [{ email }, { phoneNumber }]
                }
            }))

            let primaryContact;
            if (existingContacts.length > 0) {
                primaryContact = this.determinePrimaryContact(existingContacts);
                await this.linkContacts(primaryContact, existingContacts, email, phoneNumber);
            } else {
                primaryContact = await ContactModel.create({ email, phoneNumber, linkPrecedence: 'primary' });
            }

            const response = await this.constructResponse(primaryContact);
            res.status(200).json(response);
        } catch (error) {
            console.error('Failed to identify and link contact:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

export const contactCtrl = new ContactCtrl();
